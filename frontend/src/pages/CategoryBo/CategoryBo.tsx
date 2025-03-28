import { useEffect, useState } from "react";
import { Category } from "../../interfaces/entities";
import axios from "axios";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import "./CategoryBo.scss";

type Input = {
  label: string;
};

const CategoryBo = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get<Category[]>(
        `${import.meta.env.VITE_API_URL}/categories`
      );
      setCategories(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const { register, handleSubmit } = useForm<Input>();

  const onSubmit = async (data: Input) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/categories`, data);
      toast.success("Catégories créée avec succès!");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la catégorie");
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`);
      toast.success("Catégories supprimée avec succès!");
      fetchCategories();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de la catégorie");
    }
  };

  return (
    <div className="CategoryBo">
      <h2>Liste des catégories</h2>
      <ul className="CategoryBo-list">
        {categories.map((category) => (
          <li key={category.id}>
            <p>{category.label}</p>
            <button
              className="button"
              onClick={() => deleteCategory(category.id)}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="text-field"
          type="text"
          placeholder="Nom de la nouvelle catégorie"
          {...register("label", { required: true })}
        />
        <button className="button" type="submit">
          Créer une catégorie
        </button>
      </form>
    </div>
  );
};

export default CategoryBo;
