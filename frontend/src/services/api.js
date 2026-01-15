import axios from 'axios';

const API_BASE = 'http://127.0.0.1:5000/api';

export const getOverlays = () => axios.get(`${API_BASE}/overlays`);

export const createOverlay = (overlay) => axios.post(`${API_BASE}/overlays`, overlay);

export const updateOverlay = (id, data) => axios.put(`${API_BASE}/overlays/${id}`, data);

export const deleteOverlay = (id) => axios.delete(`${API_BASE}/overlays/${id}`);
