import Dashboard from "./pages/Dashboard.js";
import MainLayout from "./layout/MainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import Items from "./pages/Items.js";
import Parties from "./pages/Parties.js";
import { store } from "./store/store.js";
import Statuses from "./pages/Statuses.js";
import ProtectedLayout from "./layout/ProtectedLayout.js";
import Order from "./pages/Order.js";
import OrderForm from "./components/OrderForm.js";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<ProtectedLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="/orders">
                <Route index element={<Dashboard />} />
                <Route path=":id" element={<Order />} />
                <Route path="new" element={<OrderForm />} />
              </Route>
              <Route path="/parties" element={<Parties />} />
              <Route path="/items" element={<Items />} />
              <Route path="/statuses" element={<Statuses />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
