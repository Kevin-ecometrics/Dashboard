import Projects from "../../components/projects/project";

export function generateStaticParams() {
  return [
    { id: "bites_creadores_de_sonrisas" },
    { id: "doctora_pamela_perez" },
    { id: "reforma_dental" },
    { id: "Dr_martin" },
    { id: "Wislin_Farm" },
    { id: "doctor_ricardo_monge" },
    { id: "gpe_consultores" },
    { id: "chik" },
    { id: "cesia_borjon" },
    { id: "cocina_mx" },
  ];
}

export default function Page({ id }) {
  return (
    <div className="bg-white h-screen">
      <Projects id={id} />
    </div>
  );
}
