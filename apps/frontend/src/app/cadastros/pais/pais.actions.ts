"use server";
import { revalidatePath } from "next/cache";

export async function deletePaisAction(id: number) {
  await fetch(`/api/pais/${id}`, { method: "DELETE" });
  revalidatePath("/cadastros/pais");
}
