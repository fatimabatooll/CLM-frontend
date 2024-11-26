import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    GOOGLE_AUTH_SUCCESS,
    GOOGLE_AUTH_FAIL,
    LOGOUT,
    OUTLOOK_AUTH_FAIL,
    OUTLOOK_AUTH_SUCCESS
} from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    error: null,
    user: JSON.parse(localStorage.getItem('user'))
};

export default function(state = initialState, action) {
    const { type, payload } = action;

    switch(type) {
        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }
        case LOGIN_SUCCESS:
        case GOOGLE_AUTH_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return {
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh
            }
            case SIGNUP_FAIL:
                return {
                    ...state,
                    error: action.payload,  
                };
        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }
            case OUTLOOK_AUTH_SUCCESS:
                return {
                  ...state,
                  isAuthenticated: true,
                  error: null,
                };
                case OUTLOOK_AUTH_FAIL:
                    return {
                      ...state,
                      isAuthenticated: false,
                      error: action.payload, 
                    };
                    
        case USER_LOADED_SUCCESS:
            localStorage.setItem('user', JSON.stringify(payload));
            return {
                ...state,
                user: payload
            }
        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false
            }
        case USER_LOADED_FAIL:
            localStorage.removeItem('user');
            return {
                ...state,
                user: null
            }
        case GOOGLE_AUTH_FAIL:
            case LOGIN_FAIL:
                return {
                  ...state,
                  isAuthenticated: false,
                  error: payload, 
                };        case SIGNUP_FAIL:
        case LOGOUT:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('user');
            return {
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null
            }
        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
        case ACTIVATION_FAIL:
            return {
                ...state
            }
        default:
            return state
    }
};