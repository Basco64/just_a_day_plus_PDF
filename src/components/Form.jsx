import { Input } from "@components/ui/input";
import { RadioGroup, RadioGroupItem } from "@components/ui/radio-group";
import { Button } from "@components/ui/button";
import { useEffect, useState } from "react";
import { getServices, saveService } from "@utils/storage";

export default function Form({ onValidation }) {
  const [services, setServices] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [serviceInput, setServiceInput] = useState("");

  useEffect(() => {
    setServices(getServices());
  }, []);

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setServiceInput(value);
    if (value) {
      setSuggestions(
        services.filter((service) =>
          service.toLowerCase().includes(value.toLowerCase())
        )
      );
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (service) => {
    setServiceInput(service);
    setSuggestions([]);
  };

  const handleValidation = () => {
    if (serviceInput) {
      saveService(serviceInput);
      setServices((prevServices) => [...prevServices, serviceInput]);
    }
    onValidation();
    setServiceInput("");
  };

  return (
    <form className="flex items-center gap-4 p-4 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col justify-center flex-1">
        <label className="block text-sm font-medium text-gray-700 text-center">
          Client
        </label>
        <Input type="text" id="client" required className="mt-1" />
      </div>

      <div className="flex flex-col justify-center flex-1 relative">
        <label className="block text-sm font-medium text-gray-700 text-center">
          Prestation
        </label>
        <Input
          type="text"
          id="service"
          required
          className="mt-1"
          value={serviceInput}
          onChange={handleServiceChange}
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 top-full bg-white border border-gray-300 rounded-lg mt-1 w-full">
            {suggestions.map((service, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(service)}
              >
                {service}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col justify-center flex-1">
        <label className="block text-sm font-medium text-gray-700 text-center">
          Montant
        </label>
        <Input type="number" id="amount" required className="mt-1" />
      </div>

      <div className="flex flex-col justify-center flex-1">
        <label className="block text-sm font-medium text-gray-700 text-center">
          Mode de paiement
        </label>
        <RadioGroup
          defaultValue="CB"
          name="payment"
          className="mt-1 flex flex-col items-center space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="CB" id="cb" />
            <label htmlFor="cb">CB</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cheque" id="cheque" />
            <label htmlFor="cheque">Chèque</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="espece" id="espece" />
            <label htmlFor="espece">Espèces</label>
          </div>
        </RadioGroup>
      </div>

      <Button type="button" onClick={handleValidation} className="flex-1">
        Valider
      </Button>
    </form>
  );
}
