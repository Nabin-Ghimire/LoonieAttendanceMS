import { api } from './client'

export const AUTH = '/api/auth'
const USERS = '/api/users'
const OFFICE = '/api/office'
const ATTENDANCE = '/api/attendance'

export const register = (Credential) => api.post(`${AUTH}/register`, Credential);
export const login = (Credential) => api.post(`${AUTH}/login`, Credential)
export const self = () => api.get(`${AUTH}/self`);
export const refreshToken = () => api.post(`${AUTH}/refresh-token`);
export const logout = () => api.post(`${AUTH}/logout`);


export const createUser = (data) => api.post(`${USERS}/create-user`, data);
export const updateUser = (data, id) => api.patch(`${USERS}/update-user/${id}`, data);
export const deleteUser = (id) => api.delete(`${USERS}/delete-user/${id}`);
export const getSingleUser = (id) => api.get(`${USERS}/${id}`);
export const getUsers = () => api.get(`${USERS}`);


export const createOffice = (data) => api.post(`${OFFICE}/create`, data);
export const getOffices = () => api.get(`${OFFICE}`);
export const deleteOffice = (id) => api.delete(`${OFFICE}/remove/${id}`);
export const getSingleOffice = (id) => api.get(`${OFFICE}/${id}`);


export const attendUsers = (payload) => api.post(`${ATTENDANCE}/create`, payload);
export const getAttendance = () => api.get(`${ATTENDANCE}`);




