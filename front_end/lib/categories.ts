export const CATEGORY_MENU_ITEMS = [
  "ทุกหมวดหมู่",
  "กำลังภายใน",
  "โรแมนติก",
  "แฟนตาซี",
  "รักวัยรุ่น",
  "สืบสวน",
  "BoyLove",
  "GirlLove",
  "Fanfic",
  "ไลท์โนเวล",
  "ลึกลับสยองขวัญ",
  "สะท้อนชีวิต",
  "เว็บตูนโรแมนติก",
  "เว็บตูนBoyLove",
  "เว็บตูนสยองขวัญ",
  "เว็บตูนGirlLove",
  "เว็บตูนแอ็คชั่น",
] as const;

export function getCategoryHref(category: string) {
  if (category === "ทุกหมวดหมู่") return "/discover";
  return `/discover?tag=${encodeURIComponent(category)}`;
}
