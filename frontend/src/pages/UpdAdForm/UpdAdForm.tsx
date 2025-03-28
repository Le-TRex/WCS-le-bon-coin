import { useEffect, useState } from "react";
import { Category } from "../../interfaces/entities";
import { Tag } from "../../interfaces/entities";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useParams } from "react-router";

type Inputs = {
  title: string;
  description: string;
  author: string;
  price: number;
  pictureUrl: string;
  city: string;
  category: number;
  tags: string[];
};

interface AdDetailsType {
  id: number;
  title: string;
  description: string;
  author: string;
  price: number;
  pictureUrl: string;
  city: string;
  createdAt: Date;
  category: {
    id: number;
    label: string;
  };
  tags: {
    id: number;
    label: string;
  }[];
}

const UpdAdForm = () => {
  const { id } = useParams();
  // Annonce à modifier
  //const [adData, setAdData] = useState<AdDetailsType | null>(null);
  const [adData, setAdData] = useState<AdDetailsType>();

  // Toutes les catégories
  const [categories, setCategories] = useState<Category[]>([]);

  // Tous les tags
  const [tags, setTags] = useState<Tag[]>([]);

  const fetchAd = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_API_URL}/ads/${id}`
      );
      setAdData(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await axios.get<Tag[]>(
        `${import.meta.env.VITE_API_URL}/tags`
      );
      setTags(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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
    fetchAd();
    fetchCategories();
    fetchTags();
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    try {
      const dataWithTags = {
        ...data,
        tags: data.tags.map((tagId) => ({ id: tagId })),
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/ads/${id}`,
        dataWithTags
      );
      toast.success("Annonce modifiée avec succès!");
    } catch (error) {
      console.error(error);
      toast.error(
        "Une erreur est survenue lors de la modification de l'annonce"
      );
    }
  };

  // sera utilie pour discriminer création/modification annonce
  if (adData === undefined) {
    return <p>Loading ... </p>;
  }

  return (
    <div className="NewAdForm">
      <h2>Modification d'une nouvelle annonce</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          className="text-field"
          type="text"
          defaultValue={adData?.title}
          {...register("title", { required: true })}
        />
        {errors.title && <span>This field is required</span>}
        <input
          className="text-field"
          type="text"
          defaultValue={adData?.description}
          {...register("description", { required: true })}
        />
        {errors.description && <span>This field is required</span>}
        <input
          className="text-field"
          type="text"
          defaultValue={adData?.author}
          {...register("author", { required: true })}
        />
        {errors.author && <span>This field is required</span>}
        <input
          className="text-field"
          type="number"
          // placeholder à traiter
          //placeholder="0"
          defaultValue={adData?.price}
          {...register("price", { required: true })}
        />
        {errors.price && <span>This field is required</span>}
        <input
          className="text-field"
          type="text"
          defaultValue={adData?.pictureUrl}
          {...register("pictureUrl", { required: true })}
        />
        {errors.pictureUrl && <span>This field is required</span>}
        <input
          className="text-field"
          type="text"
          defaultValue={adData?.city}
          {...register("city", { required: true })}
        />
        {errors.city && <span>This field is required</span>}

        <select
          {...register("category", { required: true })}
          className="text-field"
        >
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
              selected={adData?.category.id === category.id}
            >
              {category.label}
            </option>
          ))}
          <option value="">Choisissez une catégorie</option>
        </select>
        {errors.category && <span>This field is required</span>}

        <br />

        {tags.map((tag) => (
          <label key={tag.id}>
            <input
              //defaultChecked={ad.tags.some((adTag) => adTag.id === tag.id)}
              defaultChecked={
                adData.tags.find((currTag) => currTag.id === tag.id) !==
                undefined
              }
              type="checkbox"
              value={tag.id}
              {...register(`tags`)}
            />
            {tag.label}
          </label>
        ))}

        <button className="button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default UpdAdForm;
