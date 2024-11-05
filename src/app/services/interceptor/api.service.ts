import { HttpBackend, HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import urlConfig from 'src/app/config/url.config.json';

@Injectable({
    providedIn: 'root'
    })

    export class ApiWithoutInteceptor {
    private baseURL = environment.baseURL;
    private httpClient: HttpClient;

    constructor( handler: HttpBackend) {
        this.httpClient = new HttpClient(handler);
    }

    async getAccessToken(): Promise<string | null> {
        const options = {
            url: urlConfig['profileListing'].refreshTokenUrl,
            headers: { 'Content-Type': 'application/json' },
            body: { refresh_token: localStorage.getItem('refToken') },
        };

            try {
            const res = await this.httpClient.post<any>(this.baseURL + options.url, options.body, { headers: options.headers }).toPromise();
            return res.result.access_token;
        } catch (error) {
            console.error('Error retrieving access token:', error);
            return null;
        }
        }
    }