import "../css/BlogSlider.css"; // Import the CSS file
import Assets from "../../Asset/Assets"; // Correct import

const BlogSlider = () => {
  const reviews = [
    {
      imgSrc: Assets.profile,
      name: "Bruce",
      description:
      "The team was fantastic, delivering beyond expectations. They kept everything well-organized and maintained clear communication throughout.",
    },
    {
      imgSrc: Assets.profile,
      name: "Bruce",
      description:
        "The team was fantastic, delivering beyond expectations. They kept everything well-organized and maintained clear communication throughout.",
    },
    {
      imgSrc: Assets.profile,
      name: "Bruce",
      description:
      "The team was fantastic, delivering beyond expectations. They kept everything well-organized and maintained clear communication throughout.",
    },
    {
      imgSrc: Assets.profile,
      name: "Bruce",
      description:
      "The team was fantastic, delivering beyond expectations. They kept everything well-organized and maintained clear communication throughout.",
    },
        {
          imgSrc: Assets.profile,
          name: "Bruce",
          description:
      "The team was fantastic, delivering beyond expectations. They kept everything well-organized and maintained clear communication throughout.",
    },
    {
      imgSrc: Assets.profile,
      name: "Bruce",
      description:
      "The team was fantastic, delivering beyond expectations. They kept everything well-organized and maintained clear communication throughout.",
    },
  ];

  return (
    <div className="review-slider">
      <div className="review-slider__track">
        {reviews.map((rev, index) => (
          <div key={index} className="review-card">
            <div className="review-footer">
              <img src={rev.imgSrc} alt="team member" className="review-img" />
              <h5 className="review-name">{rev.name}</h5>
            </div>
            <p className="review-text">{rev.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSlider;
