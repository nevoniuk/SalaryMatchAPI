import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Company } from "../types/database_types";
import { responseFactory } from "../utility/response_factory";
import axios from 'axios';

const apiKey = 'APRZ7A0K1T09K2UJ';

export interface companyStockInfo {
    stock_date: string,
    stock_price: number
}


const getCompanyStockInfo: AzureFunction = async (context: Context, req: HttpRequest, company: Company | null): Promise<void> => {
    if (!company) {
        context.res = responseFactory("Company not found", 404);
        return;
    }

    const symbol = company.ticker;
    var stockPrice = 0;
    var stockDate = "";

    if(symbol != "Not Public"){
        await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`)
        .then(response => {
            const {data} = response;
            stockDate = data['Meta Data']['3. Last Refreshed'];
            stockPrice =  data['Time Series (5min)'][data['Meta Data']['3. Last Refreshed']]['4. close'];
        })
        .catch(error => {
            console.error(error);
        });

        var stockInfo: companyStockInfo = {
            stock_date: stockDate,
            stock_price: stockPrice
        };

        context.res = responseFactory(stockInfo);
    }   else {
        context.res = responseFactory("Company is not public", 200);
    }
};

export default getCompanyStockInfo;