import { FlaskConical, Leaf, Droplet } from "lucide-react";

const INGREDIENTS = [
  {
    id: 1,
    icon: FlaskConical,
    title: "15% L-Ascorbic Acid",
    description:
      "The purest form of Vitamin C to visibly brighten and firm the skin's architecture.",
  },
  {
    id: 2,
    icon: Leaf,
    title: "Ferulic Acid",
    description:
      "A plant-based antioxidant that enhances the stability and efficacy of vitamins.",
  },
  {
    id: 3,
    icon: Droplet,
    title: "Hyaluronic Acid",
    description:
      "Three molecular weights for deep hydration and a plump, dewy finish.",
  },
];

export default function KeyIngredients() {
  return (
    <section className="key-ingredients">
      <h3 className="key-ingredients__heading">Key Ingredients</h3>

      <div className="key-ingredients__grid">
        {INGREDIENTS.map(({ id, icon: Icon, title, description }) => (
          <div key={id} className="key-ingredients__card">
            <Icon size={48} strokeWidth={1.25} className="key-ingredients__icon" />
            <h4 className="key-ingredients__title">{title}</h4>
            <p className="key-ingredients__desc">{description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}