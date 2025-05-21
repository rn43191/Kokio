import DataPackTabGroup from "@/components/DataPackTabGroup";
import { useGloabalEsims } from "@/queries/e-sims";

export default function Global() {
  const { data: esims, isFetching } = useGloabalEsims();

  return <DataPackTabGroup esims={esims} isLoading={isFetching} />;
}
