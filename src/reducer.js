export const initialState = {
  basket: [],
  user: null,
};
/*
export const getBasketTotal = (basket) => {
  basket?.reduce((amount, item) => item.price + amount, 0);
};*/

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_BASKET":
      for (var i = 0; i < state.basket.length; i++) {
        if (state.basket[i].product._id == action.item.product._id) {
          state.basket[i].quantity++;
          return { ...state, basket: [...state.basket] };
        }
      }
      return { ...state, basket: [...state.basket, action.item] };

    case "UPDATE_BASKET":
      for (var i = 0; i < state.basket.length; i++) {
        console.log("iM HERER ");
        if (state.basket[i].product._id == action.item.productId) {
          state.basket[i].quantity = action.item.quantity;
          return { ...state, basket: [...state.basket] };
        }
      }
      return { ...state, basket: [...state.basket, action.item] };
    case "EMPTY_BASKET":
      return { ...state, basket: [] };
    case "REMOVE_FROM_BASKET":
      var index = 0;
      for (var i = 0; i < state.basket.length; i++) {
        if (state.basket[i].product._id == action.id) {
          index = i;
          i = i + 100;
        }
      }
      let newBasket = [...state.basket];
      if (index >= 0) {
        newBasket.splice(index, 1);
      } else console.warn("cant remove item");
      return { ...state, basket: newBasket };
    case "SET_USER":
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
};
export default reducer;
