import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { toast } from "react-toastify";

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

const AdDetails = () => {
  const { id } = useParams();
  const [adData, setAdData] = useState<AdDetailsType | null>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchAd();
  }, [id]);

  const deleteAd = async (id: number) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/ads/${id}`);
      toast.success("Annonce supprimée avec succès!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la suppression de l'annonce");
    }
  };

  if (!adData) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <h2 className="ad-details-title">{adData.title}</h2>
      <section className="ad-details">
        <div className="ad-details-image-container">
          <img
            className="ad-details-image"
            src={adData.pictureUrl}
            alt={adData.title}
          />
        </div>
        <div className="ad-details-info">
          <div className="ad-details-price">{adData.price}€</div>
          <div className="ad-details-description">{adData.description}</div>
          <div className="ad-tags">
            {adData.tags.map((tag) => (
              <div key={tag.id} className="tag">
                {tag.label}
              </div>
            ))}
          </div>
          <hr className="separator" />
          <div className="ad-details-owner">
            Annoncée publiée par <b>{adData.author}</b> le{" "}
            {new Date(adData.createdAt).toLocaleDateString()} à{" "}
            {new Date(adData.createdAt).toLocaleTimeString()}
          </div>
          <a
            href="mailto:serge@serge.com"
            className="button button-primary link-button"
          >
            <svg
              aria-hidden="true"
              width="16"
              height="16"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              className="styled__BaseIcon-sc-1jsm4qr-0 llmHhT"
              stroke="currentcolor"
              stroke-width="2.5"
              fill="none"
            >
              <path d="M25 4H7a5 5 0 0 0-5 5v14a5 5 0 0 0 5 5h18a5 5 0 0 0 5-5V9a5 5 0 0 0-5-5ZM7 6h18a3 3 0 0 1 2.4 1.22s0 0-.08 0L18 15.79a3 3 0 0 1-4.06 0L4.68 7.26H4.6A3 3 0 0 1 7 6Zm18 20H7a3 3 0 0 1-3-3V9.36l8.62 7.9a5 5 0 0 0 6.76 0L28 9.36V23a3 3 0 0 1-3 3Z"></path>
            </svg>
            Envoyer un email
          </a>
          <button className="button" onClick={() => deleteAd(adData.id)}>
            Supprimer l'annonce
          </button>

          <Link to={`${import.meta.env.VITE_FRONT_URL}/ad/upd/${adData.id}`}>
            <button className="button">Modifier l'annonce</button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default AdDetails;
