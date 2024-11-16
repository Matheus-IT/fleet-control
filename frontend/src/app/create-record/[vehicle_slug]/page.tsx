import { PageProps } from "../../../../.next/types/app/page";

export default function CreateRecordPage({ params }: PageProps) {
  return <h1>Hello {params?.vehicle_slug}</h1>;
}
