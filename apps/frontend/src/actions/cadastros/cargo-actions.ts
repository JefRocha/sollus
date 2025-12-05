"use server";

import { actionClient } from "@/lib/safe-action";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  cargoSchema,
  CargoSchema,
} from "@/app/cadastros/cargo/cargo.zod.schema";
import {
  createCargo,
  updateCargo,
  deleteCargo,
} from "@/app/cadastros/cargo/cargo.service";

export const createCargoAction = actionClient
  .schema(cargoSchema)
  .action(async ({ parsedInput }) => {
    await createCargo(parsedInput);
    revalidatePath("/cadastros/cargo");
    return { success: true };
  });

export const updateCargoAction = actionClient
  .schema(cargoSchema.extend({ id: z.number().optional() }))
  .action(async ({ parsedInput }) => {
    const { id, ...rest } = parsedInput as CargoSchema & { id?: number };
    await updateCargo(id!, rest);
    revalidatePath("/cadastros/cargo");
    revalidatePath(`/cadastros/cargo/${id}`);
    return { success: true };
  });

export const deleteCargoAction = actionClient
  .schema(z.object({ id: z.number() }))
  .action(async ({ parsedInput }) => {
    const { id } = parsedInput;
    await deleteCargo(id!);
    revalidatePath("/cadastros/cargo");
    return { success: true };
  });
