"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CREATOR_STUDIO_SEED,
  CREATOR_STUDIO_STORAGE_KEY,
  createEmptyEpisodeData,
  createEmptyWorkData,
  type CreatorEpisode,
  type CreatorEpisodeTypeSpecificData,
  type CreatorWork,
  type CreatorWorkType,
  type CreatorWorkTypeSpecificData,
} from "@/lib/creator-studio";

type CreateWorkInput = Omit<CreatorWork, "id" | "updatedAt">;
type UpdateWorkInput = Omit<CreatorWork, "id" | "updatedAt">;
type CreateEpisodeInput = Omit<CreatorEpisode, "id" | "updatedAt">;
type UpdateEpisodeInput = Omit<CreatorEpisode, "id" | "workId" | "type" | "updatedAt">;

interface CreatorStudioContextValue {
  works: CreatorWork[];
  episodes: CreatorEpisode[];
  hydrated: boolean;
  createWork: (input: CreateWorkInput) => CreatorWork;
  updateWork: (workId: string, input: UpdateWorkInput) => void;
  deleteWork: (workId: string) => void;
  createEpisode: (input: CreateEpisodeInput) => CreatorEpisode;
  updateEpisode: (episodeId: string, input: UpdateEpisodeInput) => void;
  deleteEpisode: (episodeId: string) => void;
  getWorkById: (workId: string) => CreatorWork | undefined;
  getEpisodesByWorkId: (workId: string) => CreatorEpisode[];
}

const CreatorStudioContext = createContext<CreatorStudioContextValue | null>(null);

function cloneSeed() {
  return JSON.parse(JSON.stringify(CREATOR_STUDIO_SEED)) as {
    works: CreatorWork[];
    episodes: CreatorEpisode[];
  };
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatUpdatedAt(date = new Date()) {
  return date.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function touchWork(works: CreatorWork[], workId: string) {
  return works.map((work) =>
    work.id === workId ? { ...work, updatedAt: formatUpdatedAt() } : work
  );
}

export function CreatorStudioProvider({ children }: { children: React.ReactNode }) {
  const [works, setWorks] = useState<CreatorWork[]>(() => cloneSeed().works);
  const [episodes, setEpisodes] = useState<CreatorEpisode[]>(() => cloneSeed().episodes);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CREATOR_STUDIO_STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as {
        works?: CreatorWork[];
        episodes?: CreatorEpisode[];
      };

      if (Array.isArray(parsed.works)) {
        setWorks(parsed.works);
      }

      if (Array.isArray(parsed.episodes)) {
        setEpisodes(parsed.episodes);
      }
    } catch {
      window.localStorage.removeItem(CREATOR_STUDIO_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(
      CREATOR_STUDIO_STORAGE_KEY,
      JSON.stringify({ works, episodes })
    );
  }, [episodes, hydrated, works]);

  const value = useMemo<CreatorStudioContextValue>(() => {
    return {
      works,
      episodes,
      hydrated,
      createWork(input) {
        const newWork: CreatorWork = {
          ...input,
          id: createId("work"),
          updatedAt: formatUpdatedAt(),
          typeSpecificData:
            input.typeSpecificData ?? createEmptyWorkData(input.type as CreatorWorkType),
        };

        setWorks((prev) => [newWork, ...prev]);
        return newWork;
      },
      updateWork(workId, input) {
        setWorks((prev) =>
          prev.map((work) =>
            work.id === workId
              ? {
                  ...work,
                  ...input,
                  updatedAt: formatUpdatedAt(),
                  typeSpecificData:
                    input.typeSpecificData ??
                    (createEmptyWorkData(input.type as CreatorWorkType) as CreatorWorkTypeSpecificData),
                }
              : work
          )
        );
      },
      deleteWork(workId) {
        setWorks((prev) => prev.filter((work) => work.id !== workId));
        setEpisodes((prev) => prev.filter((episode) => episode.workId !== workId));
      },
      createEpisode(input) {
        const newEpisode: CreatorEpisode = {
          ...input,
          id: createId("episode"),
          updatedAt: new Date().toISOString(),
          typeSpecificData:
            input.typeSpecificData ??
            createEmptyEpisodeData(input.type as CreatorWorkType),
        };

        setEpisodes((prev) =>
          [...prev, newEpisode].sort((left, right) => left.number - right.number)
        );
        setWorks((prev) => touchWork(prev, input.workId));
        return newEpisode;
      },
      updateEpisode(episodeId, input) {
        let updatedWorkId = "";

        setEpisodes((prev) =>
          prev
            .map((episode) => {
              if (episode.id !== episodeId) return episode;
              updatedWorkId = episode.workId;
              return {
                ...episode,
                ...input,
                updatedAt: new Date().toISOString(),
                typeSpecificData:
                  input.typeSpecificData ??
                  (createEmptyEpisodeData(episode.type) as CreatorEpisodeTypeSpecificData),
              };
            })
            .sort((left, right) => left.number - right.number)
        );

        if (updatedWorkId) {
          setWorks((prev) => touchWork(prev, updatedWorkId));
        }
      },
      deleteEpisode(episodeId) {
        let deletedWorkId = "";

        setEpisodes((prev) =>
          prev.filter((episode) => {
            if (episode.id === episodeId) {
              deletedWorkId = episode.workId;
              return false;
            }
            return true;
          })
        );

        if (deletedWorkId) {
          setWorks((prev) => touchWork(prev, deletedWorkId));
        }
      },
      getWorkById(workId) {
        return works.find((work) => work.id === workId);
      },
      getEpisodesByWorkId(workId) {
        return episodes
          .filter((episode) => episode.workId === workId)
          .sort((left, right) => left.number - right.number);
      },
    };
  }, [episodes, hydrated, works]);

  return (
    <CreatorStudioContext.Provider value={value}>
      {children}
    </CreatorStudioContext.Provider>
  );
}

export function useCreatorStudio() {
  const context = useContext(CreatorStudioContext);

  if (!context) {
    throw new Error("useCreatorStudio must be used within a CreatorStudioProvider");
  }

  return context;
}
