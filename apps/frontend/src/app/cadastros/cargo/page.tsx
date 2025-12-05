import { getCargos } from "./cargo.service";
import { CargoListClient } from "./_components/cargo-list-client";

export default async function CargoPage() {
  const data = await getCargos();
  return <CargoListClient data={data as any[]} />;
}
