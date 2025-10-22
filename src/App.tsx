import {useState} from "react";
import {fetchArrivalsByPostcode} from "./backend/fetchArrivals.ts";

function App() {
    const [postCode, setPostCode] = useState("");
    const [arrivalsData, setArrivalsData] = useState<string>("");
    const [loading, setLoading] = useState(false);

    async function handleButtonClick() {
        setLoading(true);
        const data = await fetchArrivalsByPostcode(postCode);

        const text = data?.map(
                (bus) =>
                    `🚌 Line ${bus.lineName} to ${bus.destinationName} arriving in ${bus.timeToStationMinutes.toFixed(1)} min`
            )
            .join("\n");

        setArrivalsData(text || "No arrivals found");
        setLoading(false);
    }
  return (
      <>
        <h1 className="text-3xl font-bold underline text-center text-cyan-600 m-4"
        >BusBoard</h1>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={postCode}
              onChange={(e) => setPostCode(e.target.value)}
              placeholder="Enter postcode"
              className="px-3 py-2 border rounded"
            />

            <button onClick={handleButtonClick} disabled={!postCode || loading}>
              {loading ? "Loading..." : "Check"}
            </button>
          </div>

          {
              loading ? (
              <p className="mt-4 text-gray-600">Loading...</p>
            ) : (
              arrivalsData && (
                  <pre className="mt-4 p-4 bg-white rounded shadow w-3/4">
                      {arrivalsData}
                  </pre>
              )
            )
          }

          </>
  )
}

export default App
