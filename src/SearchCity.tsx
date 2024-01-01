
import { useState } from 'react';
import { fetchPlace } from './fetchPlace';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from './ui/button';

interface SearchCityProps {
    fetch: (city: string) => void;
}

const SearchCity: React.FC<SearchCityProps> = ({ fetch }) => {
    const [city, setCity] = useState<string>("");
    const [autocompleteCities, setAutocompleteCities] = useState(['']);
    const [autocompleteErr, setAutocompleteErr] = useState("");

    const handleCityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setCity(e.target.value);
        if (!city) return;

        const res = await fetchPlace(city);
        !autocompleteCities.includes(e.target.value) &&
            res.features &&
            setAutocompleteCities(res.features.map((place: any) => place.place_name));
        res.error ? setAutocompleteErr(res.error) : setAutocompleteErr("");
    };
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        // Call the fetch function passed in the props
        fetch(city);
        setCity('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center space-x-2 justify-center">
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={autocompleteCities}
                        sx={{ width: 300 }}
                        value={city}
                        onChange={(event, newValue) => setCity(newValue||"")}
                        renderInput={(params) => <TextField
                            {...params}
                            type="text"
                            id="city"
                            name="city"
                            size="small"
                            onChange={handleCityChange}
                            value={city}
                            autoComplete="on"
                        />}
                        />
                <Button type="submit" className='ml-3'>Submit</Button>
            </div>

    

        </form>
    );
};

export default SearchCity;