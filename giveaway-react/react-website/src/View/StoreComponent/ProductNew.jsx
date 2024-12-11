/* eslint-disable react/jsx-key */
import React from "react";

import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";

import { ProductDetailsApi } from "../../Slices/ProductDetailsSlice";
import Loader from "../../Common/Loader";
import { AddToCartApi } from "../../Slices/AddToCartSlice";

import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { REACT_API_URL } from "../../../config";
import { SetAuthCartId } from "../../Slices/LoginSlice";
import { GetCartItemsApi } from "../../Slices/CartSlice";

const ProductNew = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cardIdLength } = useSelector((state) => state.loginAction);
  const { loading, ProductDetails } = useSelector(
    (state) => state.productDetailsAction
  );

  const [priceObject, setPriceObject] = useState("");
  const [variableProductDetails, setVariableProductDetails] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeStore, setSizeStore] = useState(0);
  // const [productId, setProductId] = useState("");

  // // console.log(ProductDetails, "..>");

  const GetProductDetails = async () => {
    const response = await dispatch(ProductDetailsApi(id));

    if (response.success) {
      const formatVariableProduct = response?.data[0]?.variableProducts?.map(
        (eachProduct) => {
          return {
            size: eachProduct?.attributes[0]?.value,
            price: eachProduct?.price,
            variableId: eachProduct?._id,
          };
        }
      );
      // setProductId(response?.data[0]._id);
      setVariableProductDetails(formatVariableProduct);
      setPriceObject(formatVariableProduct[0]);
      // setSizeStore(formatVariableProduct[0]);
    }
  };

  useEffect(() => {
    GetProductDetails();
  }, []);

  const onSizeSelected = (e) => {
    // console.log(e.target.value);
    const filterProductDetails = variableProductDetails.filter(
      (eachItem) => e.target.value === eachItem.variableId
    );

    setPriceObject(filterProductDetails[0]);
  };

  const handleAddToCart = async () => {
    const cartDetails = {
      product_id: id,
      variable_id: priceObject.variableId,
      quantity: quantity,
    };

    try {
      const cartId = localStorage?.getItem("cartid");
      if (cartId) {
        cartDetails.cart_id = cartId;
      }
      const res = await dispatch(AddToCartApi(cartDetails));
      // // console.log(res, "res triggering");
      dispatch(SetAuthCartId(res?.data?._id));
      if (res.success) {
        dispatch(GetCartItemsApi(cardIdLength));
        localStorage.setItem("cartid", res.data._id);
        // navigate("/cart");
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      // console.log(err);
    }
  };

  const handleIncrement = () => {
    setQuantity((quantity) => parseInt(quantity) + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((quantity) => parseInt(quantity) - 1);
    } else {
      setQuantity(1);
    }
  };

  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  };
  // // console.log("🚀 ~ ProductNew ~ sizeStore:", sizeStore);
  // // console.log(priceObject, "...........<>");
  return (
    <div>
      <div className="row d-flex justify-content-center my-2">
        <div className="col-md-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque quis
          placerat lectus. Mauris nec odio sed enim varius pretium. Vestibulum
          mollis auctor est. Integer ut elementum mauris. Proin pellentesque,
          eros eget tristique volutpat, tortor metus accumsan dui, sed tempor
          tortor nisi sit amet mi. Pellentesque at ultricies libero. Praesent at
          gravida enim. Mauris bibendum euismod sem. Fusce vulputate bibendum
          lacus. Proin sit amet volutpat justo. Vivamus eget varius magna. Donec
          venenatis ex vitae ultricies accumsan. Vivamus facilisis tempus lacus
          finibus bibendum. Vivamus venenatis quam eget magna eleifend
          condimentum id nec risus. Duis finibus quam quis neque condimentum
          vulputate. Suspendisse nec volutpat urna. Aliquam justo est, accumsan
          eget accumsan pretium, finibus ut augue. Orci varius natoque penatibus
          et magnis dis parturient montes, nascetur ridiculus mus. Nunc
          sollicitudin nisl quis tempor bibendum. Phasellus eu lectus at mauris
          viverra tempor. Fusce egestas cursus ligula, vel dapibus ipsum
          sollicitudin eget. Aliquam feugiat lorem velit, nec semper justo
          congue nec. Vestibulum maximus lectus at odio porta molestie. Nulla
          sed nunc a arcu lobortis varius. Sed pulvinar eros id justo pulvinar,
          ac egestas urna eleifend. Nam porta, tellus non porttitor pretium,
          tellus ex varius purus, laoreet maximus velit enim sed mi. Fusce
          egestas risus dolor, eu tempus ipsum scelerisque sit amet. Vestibulum
          nec ex nibh. Nullam non cursus arcu. In sed dolor mi. Sed vehicula vel
          nulla vel facilisis. Curabitur imperdiet risus ut tincidunt egestas.
          Orci varius natoque penatibus et magnis dis parturient montes,
          nascetur ridiculus mus. Sed lectus ante, hendrerit luctus molestie
          vel, vehicula vel turpis. Fusce nec purus ac urna fermentum pharetra
          ac ut nisl. Cras vel ultrices lectus, et fermentum lectus. Nam mattis
          felis quis porta feugiat. Mauris luctus dui id odio rhoncus ultrices.
          Phasellus lacus magna, ultrices eget suscipit facilisis, tempus at
          dolor. Sed tempus turpis mauris, vel ullamcorper nulla pretium in. In
          cursus nunc suscipit odio venenatis porttitor. Sed lectus velit,
          auctor at posuere sed, auctor ac urna. Aenean consectetur dolor vitae
          tellus auctor, sit amet facilisis nunc efficitur. Vivamus sed metus ut
          ex iaculis elementum. Integer ut ornare est. Pellentesque quis mauris
          at est ullamcorper suscipit in nec lectus. Maecenas nec tincidunt
          risus. Praesent a nulla semper, feugiat tortor sed, eleifend mi.
          Praesent condimentum augue ut erat dapibus, vel auctor tellus iaculis.
          Quisque at sem sodales, sagittis mauris vel, posuere massa.
          Pellentesque cursus justo nec dictum egestas. Proin non nisi id leo
          lacinia ultricies ut nec elit.
        </div>
      </div>
    </div>
  );
};

export default ProductNew;
