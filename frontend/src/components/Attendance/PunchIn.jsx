import { useMutation, useQueryClient } from '@tanstack/react-query';
import { attendUsers } from '../../http/api';
import getCurrentLocation from '../../utils/geolocation';
import { useState } from 'react';

const punchApi = async (payload) => {
  const { data } = await attendUsers(payload);
  return data;
};

const PunchIn = () => {
  const queryClient = useQueryClient();
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loadingGeo, setLoadingGeo] = useState(false);

  const mutation = useMutation({
    mutationFn: punchApi,
    onSuccess: () => {
      queryClient.invalidateQueries(['attendance']);
      alert('Punch successful');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || 'Punch failed';
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
    if (!lat || !lng) {
      alert('Please provide location or use geolocation');
      return;
    }
    mutation.mutate({ lat, lng });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div>

        <label className="label"><span className="label-text">Latitude</span></label>

        <input className="input input-bordered w-full" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Latitude" />
      </div>

      <div>
        <label className="label"><span className="label-text">Longitude</span></label>
        <input className="input input-bordered w-full" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Longitude" />
      </div>

      <div className="flex gap-2">
        <button type="button" className="btn btn-outline" onClick={handleGeo} disabled={loadingGeo}>{loadingGeo ? 'Locating...' : 'Use my location'}</button>
        <button type="submit" className="btn btn-primary" disabled={mutation.isLoading}>{mutation.isLoading ? 'Punching...' : 'Punch'}</button>
      </div>
    </form>
  );
};

export default PunchIn;
