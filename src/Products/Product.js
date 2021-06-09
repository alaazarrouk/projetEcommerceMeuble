import React from "react";
import "./Product.css";
import ChaiseMeuble from "../assets/chaise-meuble.jpg";

const Product = ({
  title,
  material,
  dimension,
  categorie,
  description,
  price,
  image,
}) => {
  return (
    <div className="Product">
      <div className="Product_content">
        <div className="Product_left_items">
          <div className="Product_left_items_title">{title}</div>
          <div className="Product_left_items_description">
            <div className="description_title">Descreption :</div>
            <div className="description_content">{description}</div>
          </div>
          <div className="Product_left_items_fabrication">
            <div className="fabrication_title">Matiére :</div>
            <div className="fabrication_content">{material}</div>
          </div>
          <div className="Product_left_items_dimentions">
            <div className="dimentions_title">Dimension :</div>
            <div className="dimentions_content">{dimension}</div>
          </div>
          
        </div>
        <div className="Product_right_items">
          <img
            src={"https://projetecommercebackend.herokuapp.com/images/" + image}
          />
        </div>
      </div>
    </div>
  );
};

export default Product;
