import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createOffice } from '../../http/api';
import getCurrentLocation from '../../utils/geolocation';
import { useState } from 'react';

const officeCreation = async (payload) => {
  const { data } = await createOffice(payload);
  return data;
};

const Offices = () => {
  const queryClient = useQueryClient();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [name, setName] = useState('');
  const [loadingGeo, setLoadingGeo] = useState(false);

  const officeMutation = useMutation({
    mutationFn: officeCreation,
    onSuccess: () => {
      queryClient.invalidateQueries(['offices']);
      alert('Office created successfully');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Office creation failed';
      alert(msg);
    }
  });

  const handleGeo = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }
    setLoadingGeo(true);
    getCurrentLocation()
      .then(({ latitude, longitude }) => {
        setLat(String(latitude));
        setLng(String(longitude));
      })
      .catch((err) => {
        alert('Failed to get location: ' + (err?.message || err));
      })
      .finally(() => setLoadingGeo(false));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!lat || !lng || !name) {
      alert('Please Define all fields');
      return;
    }
    officeMutation.mutate({ name, lat, lng });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md space-y-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Create Office</h2>

        <div>
          <label className="label"><span className="label-text">Name</span></label>
          <input
            className="input input-bordered w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Office Name"
          />
        </div>

        <div>
          <label className="label"><span className="label-text">Latitude</span></label>
          <input
            className="input input-bordered w-full"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
            placeholder="Latitude"
          />
        </div>

        <div>
          <label className="label"><span className="label-text">Longitude</span></label>
          <input
            className="input input-bordered w-full"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
            placeholder="Longitude"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <button
            type="button"
            className="btn btn-outline flex-1"
            onClick={handleGeo}
            disabled={loadingGeo}
          >
            {loadingGeo ? 'Locating...' : 'Use my location'}
          </button>

          <button
            type="submit"
            className="btn btn-primary flex-1"
            disabled={officeMutation.isLoading}
          >
            {officeMutation.isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Offices;