import { useState, useCallback } from "react";
// напишем собственный хук каторый будет делать запрос на сервер
export const useHttp = () => {
    // в приложении в 3 компанентах повторяются состояния loading и error поэому мы их вынесим и будем использовать только в этом хуке
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // функция каторая будет делать запрос помещаем в useCallback потому что она может передаваться в дочерние компаненты
    // url куда будем посылать запрос
    // method какой запрос по умаолчанию GET
    // body то что передаем при запросе GET ничего не передаем null
    // headers по умолчанию объект с заголовками
    const request  = useCallback(async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {

        setLoading(true); // перед тем как отправить запрос ставим loading в true как это делалось во всех компанентах
        // будем использовать для запроса try catch потому что в этой функции запрос не будет обрабатоваться 
        try {
            const response = await fetch(url, {method, body, headers}); // ответ от сервера будет помещаться в response

            if (!response.ok) { // если в ответе не окей то будем выбрасывать ошибку и переходить в блок кода catch
                throw new Error(`Could not fetch ${url}, status: ${response.status}`); 
            }

            const data = await response.json();

            setLoading(false); // когда данные загрузились loading ставим в false
            return data; // возвращаем данные полученные от сервера
        } catch(e) {
            setLoading(false); // если пришла ошибка ставим loading в false
            setError(e.message); // в error записываем сообщение об ошибке свойство message
            throw e; // выкидываем их кетча ошибку (ошибка в переменной e каторая приходит из браузера)
        }

    }, [])
    // напишем еще одну функцию каторая будет чистить ошибки null в error
    // например если в RandomChar рандом попадет на id каторой не сущесвтует будет ошибка 404 и при нажатии Try it следующий запрос не пойдет
    // каждый раз там будет весеть ошибка поэтому ее надо очистить
    const clearError = useCallback(() => setError(null), [])

    return {loading, request, error, clearError}
    // теперь этот хук универсальный его можно использовать где угодо в приложении
}