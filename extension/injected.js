(function () {

    const XHR = XMLHttpRequest.prototype

    const open = XHR.open
    const send = XHR.send
    const setRequestHeader = XHR.setRequestHeader

    XHR.open = function (method, url) {
        // this._method = method
        this._url = url
        this._requestHeaders = {}
        // this._startTime = (new Date()).toISOString()

        return open.apply(this, arguments)
    }

    XHR.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value
        return setRequestHeader.apply(this, arguments)
    }

    XHR.send = function (postData) {

        this.addEventListener('load', function () {
            // const endTime = (new Date()).toISOString()

            const myUrl = this._url ? this._url.toLowerCase() : this._url
            if (myUrl) {

                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            // here you get the REQUEST HEADERS, in JSON format, so you can also use JSON.parse
                            this._requestHeaders = postData
                        } catch (err) {
                            // console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                            // console.log(err);
                        }
                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                        // do something if you need
                    }
                }

                // here you get the RESPONSE HEADERS
                // const responseHeaders = this.getAllResponseHeaders()
                try{
                    this.responseText
                }catch (e){
                    return
                }
                if (this.responseType !== 'blob' && this.responseText) {
                    // responseText is string or null
                    try {

                        // here you get RESPONSE TEXT (BODY), in JSON format, so you can use JSON.parse
                        const arr = this.responseText

                        // printing url, request headers, response headers, response body, to console
                        if (this._url.includes('/product/portal/search?')) {
                            // console.log(this._url)
                            // console.log(arr)
                            let dataDOMElement = document.getElementById('__interceptedData')
                            if (!dataDOMElement) {
                                dataDOMElement = document.createElement('div')
                                dataDOMElement.id = '__interceptedData'
                                dataDOMElement.style.height = 0
                                dataDOMElement.style.overflow = 'hidden'
                                document.body.appendChild(dataDOMElement)
                            }
                            dataDOMElement.innerText = arr
                            dataDOMElement.classList.add('newdata')
                            dataDOMElement.classList.add('sample')
                        }

                        // console.log(JSON.parse(this._requestHeaders));
                        // console.log(responseHeaders);

                    } catch (err) {
                        // console.log("Error in responseType try catch");
                        // console.log(err);
                    }
                }

            }
        })

        return send.apply(this, arguments)
    }

})(XMLHttpRequest)
