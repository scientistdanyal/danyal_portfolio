"use client";

import { FormEvent, useState } from "react";
import { api } from "@/lib/api";
import { useLoadOnMount } from "@/hooks/useLoadOnMount";
import {
  Field,
  PaperCard,
  Plate,
  buttonClass,
  ghostButtonClass,
  inputClass,
} from "@/components/admin/ui";

type Skill = {
  id: string;
  name: string;
  type: "language" | "framework" | "tool";
  proficiency: number;
};

type Category = {
  id: string;
  name: string;
  skills: Skill[];
};

export default function AdminSkillsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [skillForm, setSkillForm] = useState({
    categoryId: "",
    name: "",
    type: "language" as Skill["type"],
    proficiency: 80,
  });
  async function load() {
    const data = await api<Category[]>("/api/admin/skills");
    setCategories(data);
    setSkillForm((p) => (p.categoryId || !data[0] ? p : { ...p, categoryId: data[0].id }));
  }

  const { error } = useLoadOnMount(load);

  async function addCategory(e: FormEvent) {
    e.preventDefault();
    await api("/api/admin/skills/categories", {
      method: "POST",
      body: { name: categoryName },
    });
    setCategoryName("");
    await load();
  }

  async function addSkill(e: FormEvent) {
    e.preventDefault();
    await api("/api/admin/skills", { method: "POST", body: skillForm });
    setSkillForm((p) => ({ ...p, name: "", proficiency: 80 }));
    await load();
  }

  async function removeSkill(id: string) {
    await api(`/api/admin/skills/${id}`, { method: "DELETE" });
    await load();
  }

  async function removeCategory(id: string) {
    await api(`/api/admin/skills/categories/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <Plate label="FIG. A03 — SKILLS">
      <h1 className="text-3xl font-semibold tracking-tight">Skills</h1>
      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <form onSubmit={(e) => void addCategory(e)} className="mt-6 flex gap-3">
        <input
          className={inputClass}
          placeholder="New category (e.g. Frontend)"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <button type="submit" className={buttonClass}>
          Add category
        </button>
      </form>

      <form onSubmit={(e) => void addSkill(e)} className="mt-6 grid gap-3 md:grid-cols-4">
        <Field label="Category">
          <select
            className={inputClass}
            value={skillForm.categoryId}
            onChange={(e) => setSkillForm((p) => ({ ...p, categoryId: e.target.value }))}
            required
          >
            <option value="">Select…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Skill">
          <input
            className={inputClass}
            value={skillForm.name}
            onChange={(e) => setSkillForm((p) => ({ ...p, name: e.target.value }))}
            required
          />
        </Field>
        <Field label="Type">
          <select
            className={inputClass}
            value={skillForm.type}
            onChange={(e) =>
              setSkillForm((p) => ({
                ...p,
                type: e.target.value as Skill["type"],
              }))
            }
          >
            <option value="language">language</option>
            <option value="framework">framework</option>
            <option value="tool">tool</option>
          </select>
        </Field>
        <Field label="Proficiency (1-100)">
          <input
            className={inputClass}
            type="number"
            min={1}
            max={100}
            value={skillForm.proficiency}
            onChange={(e) =>
              setSkillForm((p) => ({ ...p, proficiency: Number(e.target.value) }))
            }
          />
        </Field>
        <button type="submit" className={`${buttonClass} md:col-span-4`}>
          Add skill
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {categories.map((category) => (
          <PaperCard key={category.id}>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-semibold">{category.name}</h2>
              <button
                type="button"
                className={ghostButtonClass}
                onClick={() => void removeCategory(category.id)}
              >
                Delete category
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {category.skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-center justify-between gap-3 font-[family-name:var(--font-jetbrains-mono)] text-xs"
                >
                  <span>
                    {skill.name} · {skill.type} · {skill.proficiency}%
                  </span>
                  <button
                    type="button"
                    className={ghostButtonClass}
                    onClick={() => void removeSkill(skill.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </PaperCard>
        ))}
      </div>
    </Plate>
  );
}
