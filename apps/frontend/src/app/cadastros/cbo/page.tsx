import { getCbos } from "./cbo.service";
import { CboListClient } from "./_components/cbo-list-client";

export default async function CboPage() {
  const data = await getCbos();
  return <CboListClient data={data} />;
}
