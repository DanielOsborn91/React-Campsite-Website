import { PARTNERS } from "../shared/partners";
import * as ActionTypes from "./ActionTypes";


export const Partners = (state = { isLoading: true, errMess: null, partners: [] }, action) => {
	switch (action.type) {
		case ActionTypes.ADD_PARTNERS:
			const partners = action.payload;
			return { ...state, partners: state.partners.concat(partners) };

		case ActionTypes.PARTNERS_FAILED:
			return { ...state, errMess: action.payload };

		case ActionTypes.PARTNERS_LOADING:
			return { ...state, isLoading: false, errMess: action.payload};

		default:
			return state;
	}
};