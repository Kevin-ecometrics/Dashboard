import Projects from "@/app/components/projects/project";

export function generateStaticParams() {
  return [
    { id: "bites_creadores_de_sonrisas" },
    { id: "doctora_pamela_perez" },
    { id: "reforma_dental" },
    { id: "syl_talento" },
  ];
}

export default function Page() {
  return (
    <div className="bg-white h-screen">
      <Projects />
    </div>
  );
}
