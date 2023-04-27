export default class ServerRequest {
    constructor(url) {
        this.url = url;
    }


    async get(url,body) {
        const jsonResponse = await this.#fetch({
            url:url,
            httpMethod:'GET',
            body:body,
        })

        return jsonResponse;
    }
    async post(url,body) {
        const jsonResponse = await this.#fetch({
            url:url,
            httpMethod:'POST',
            body:body,
        })
        return jsonResponse;
    }
    async patch(url,body) {
        const jsonResponse = await this.#fetch({
            url:url,
            httpMethod:'PATCH',
            body:body,
        })
        return jsonResponse;
    }

    async delete(url,body) {
        const jsonResponse = await this.#fetch({
            url:url,
            httpMethod:'DELETE',
            body:body,
        })
        return jsonResponse;
    }



    async #fetch(fetchOption) {
        fetchOption.url = fetchOption.url ? `/${fetchOption.url}` : '';
        let jsonResponse;
        try {
            const fetchInit = {};
            fetchInit.method = fetchOption.httpMethod;
            fetchInit.headers = {'Content-Type': 'application/json',}
            if(fetchOption.body) fetchInit.body = JSON.stringify(fetchOption.body);
            const response = await fetch(`${this.url}${fetchOption.url}`, fetchInit);
            jsonResponse = await response.json();
        } catch (error) {
            jsonResponse = error;
        }
        return jsonResponse;
    }
}