import React from "react";

const CATEGORIES = [
  {
    name: "Cleansers",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3fjnlCAnEpNUUaQ0ySKe63oRewk5f1G1-c43GoLO_muuap5HMVKWa4c8w7TYflSDamM9BqAfyqdBo9Q3Fj2j0Jq_B0jMophlx1OTINuu5pFiYgJ3RqG4olY0e7DPgrc69rPD9ryFugpkxdCgIwChJWzjs9Sn1IDrchrEif9PXAb4zW_hwKr-99hBMiMn5rU5vLBupzjOHqLDA3r8s4Hix6BnluWYeW1C2c_QCMocpRY6TrY0vr_nVsUH-6v5nJ_0Tlytqlho79VQp",
  },
  {
    name: "Serums",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsjZsQX-nYHVYAMnev1_ygVjfew_Mp3mCtxGkmbhBYDZ8wuK_aK6g9_EHA50OMntVvxYh6ZUPHtqYGBFraXUwczdZt_qiUTDy6PpNauPIlTJem3BzwvFtiiwBA_ftJfOUV5Pysiw8lIKhrbiT51-xCGSMsLk9Js-1OGfgy_JQjVHS7H4CxzGvn5o1lOmNV2QRuIWBQ9-NOHiTkuj9kLysajL7qTZn_lsEssth6a9q6t3NfV-mAJNKd94oMfd4BTFUnak8YxxHAjD4d",
  },
  {
    name: "Moisturizers",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB8s0GXRsqTEK5zeyu9NdZtKUShs2Q1xM7OkTgM3A4lIVJ2O7qVUYUEH_8zJgmCI1tG3-syrap8_tkCuXai7yJvUi8N6sTXZvHqk1gZcJeWn8xxr362m7nu7nHgccaAnwm9plLDIGH50fagOP8dTONhDz-ripDoraJuj1fw9dD2wsTujoSbKv9jFhKcjYCfYJJTvyz1LAiU0Ym-Bilu_HFPgi1PWW1hNtn-3u8qLU3hJtFF28ukmkSZ87sX307mZrDmSbx_Nmh5v4sr",
  },
];

export default function Categories() {
  return (
    <section className="wrap">
      <h2 className="section-title">The Essence of Care</h2>
      <div className="cat-grid">
        {CATEGORIES.map((cat) => (
          <a className="cat-item" href="#" key={cat.name}>
            <div className="cat-img-wrap">
              <img src={cat.img} alt={cat.name} />
            </div>
            <span className="cat-label">{cat.name}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
