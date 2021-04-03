import axios from "axios";
import Papa from "papaparse";

import {Product} from "./types";

export default {
  list: async (): Promise<Product[]> => {
    return axios
      .get(
        `https://docs.google.com/spreadsheets/d/e/2PACX-1vRl8JwfjKc54tCnNRTUsHAXWce16wqH9-2MykOloi1TM8ZGNhXpa1Wlb3e7nnneejGcyEgmJRcQc5zb/pub?output=csv`,
        {
          responseType: "blob", //la respuesta no es un JSON 
        },
      )
      .then(
        (response) =>
          new Promise<Product[]>((resolve, reject) => {
            Papa.parse(response.data, {
              header: true,
              complete: (results) => {
                const products = results.data as Product[];

                return resolve(
                  products.map((product) => ({
                    ...product,
                    price: Number(product.price),
                  })),
                );
              },
              error: (error) => reject(error.message),
            });
          }),
      );
  },
};