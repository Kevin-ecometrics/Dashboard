"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import System from "../../components/projects/calendar";

function Page() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/user`, {
          withCredentials: true,
        });
        if (res && res.data.user) {
          setUser(res.data.user);
          const resProjects = await axios.get(
            `http://localhost:3001/api/projects?userId=${res.data.user.id}`,
            { withCredentials: true }
          );
          if (resProjects && resProjects.data) {
            setProjects(resProjects.data);
          }
        } else {
          router.push("/");
        }
      } catch (err) {
        console.error(err);
        router.push("/");
      }
    };
    fetchUserAndProjects();
  }, [router]);

  return (
    <div>
      {" "}
      {user &&
      (user.email === "juanmanuel@e-commetrics.com" ||
        user.email === "admin@gmail.com" ||
        user.email === "draanyimanchola@bitescreadoresdesonrisas.com") ? (
        <System projects={projects} />
      ) : null}
    </div>
  );
}

export default Page;
