// в папке services обычно лежат те части приложения каторые будут общаться со стороннеми ресурсами например с API
import { useHttp } from "../hooks/http.hook";
// теперь будем использовать MarvelService как функцию вместе с хуком useHttp

// при создании класса мы не ипортируем компанент потому что этот класс будет на чистом js
// class MarvelService {
const useMarvelService = () => {
    const {loading, request, error, clearError} = useHttp();
    // по принципу Don't Repeat Yourself
    // если название свойства начинается с _ то его значение менять нельзя
    const _apiBAse = 'https://gateway.marvel.com:443/v1/public/';
    const _apiKey = 'apikey=1d096c383f311c804b3c29f65d5df5e1';
    const _baseOffset = 210;

    // эта функция нам уже не нужна ее заменяет собсвтенный хук
    // getResource = async (url) => { // так как get запрос объект для отправки не нужен и объект с заголовками тоже
    //     const res = await fetch(url);
    //     // если fetch столкнется с какой нибудь ошибкой в Http запросе 404 500 502 и тд. он не выдаст catch (reject)
    //     // ошибка для него отсутсвие интернета или какие то неполадки на сервере или в самом запросе
    //     // поэтому такое поведение надо вручную обработать
    //     // 2 свойства которые есть у промиса который возврощается из fetch
    //     // .ok это свойство каторое нам дословно говорит что мы что то получили и всё окей либо не окей
    //     // status выдаёт статус который вернул нам сервер 200 404 500 

    //     if (!res.ok) { // !res.ok если что то не так пошло 404 500 502 то сработает блок кода catch (reject)
    //         throw new Error(`Could not fetch ${url}, status: ${res.status}`); 
    //         // new Error() объект ошибки в него помещаем текст ошибки каторый нам необходимо выдать
    //         // оператор throw испиользуется что бы выкинуть ошибку (те ошибки каторые попадают в консоль)
    //     }

    //     return await res.json(); // сдесь тоже не известно сколько метод json() будет переводить возвращённый промис в обычный обект 
    // };

    // добавим в класс методы каотрые будут делать запросы
    // apikey=1d096c383f311c804b3c29f65d5df5e1 публичный ключ нужно всегда подставлять что бы сервис понимал что запрос делает 
    // авторизированный пользователь
    // getAllCharacters = async () => {
        // getAllCharacters = async (offset = this._baseOffset) => {
        const getAllCharacters = async (offset = _baseOffset) => {
        // return this.getResource(`https://gateway.marvel.com:443/v1/public/characters?apikey=1d096c383f311c804b3c29f65d5df5e1`)
        // метод вернет объект в формате json
        // таким образом приходит объект со всеми персонажеми получаем только 20 персонажей
        // return this.getResource(`${this._apiBAse}characters?limit=9&offset=210&${this._apiKey}`)
        // таким образом в results получаем только 9 персонажей
        // const res = await this.getResource(`${this._apiBAse}characters?limit=9&offset=210&${this._apiKey}`)
        // const res = await this.getResource(`${this._apiBAse}characters?limit=9&offset=${this._baseOffset}&${this._apiKey}`)
        // const res = await this.getResource(`${this._apiBAse}characters?limit=9&offset=${offset}&${this._apiKey}`)
        const res = await request(`${_apiBAse}characters?limit=9&offset=${offset}&${_apiKey}`)
         // в этом случае res это большой объект в катором лежит массив с нашеми результатами res.data.results
         // и так как это массив можно использовать map что бы сформировать массив с новыми объектами
        //  return res.data.results.map(this._transformCharacter)
        return res.data.results.map(_transformCharacter)
         // map(this._transformCharacter) таким образом мы как бы передаём колбек функцию каторая будет что то делать 
         // с теми элиментами каторые приходят к ней по очереди
         // тоесть как char будет переходить каждый отдельный объект персонажа попорядку в итоге сформируется массив с объектами
    }
    // метд для получения одного персонажа
    const getCharacters = async (id) => {
        //сдесь нужно изменить запрос limit и offset удаляем, ?apikey оставляем после characters вставляем /${id} каторый приходит как аргумент
        // return this.getResource(`${this._apiBAse}characters/${id}?${this._apiKey}`)
        // аким образом приходит объект с одним персонажем по id
        // const res = await this.getResource(`${this._apiBAse}characters/${id}?${this._apiKey}`)
        const res = await request(`${_apiBAse}characters/${id}?${_apiKey}`)
        // теперь результат (объект с одним персонажем) запишется в переменную res и ее передаём в метод _transformCharacter
        // return this._transformCharacter(res);
        // return this._transformCharacter(res.data.results[0]);
        return _transformCharacter(res.data.results[0]);
        // теперь из этого метода возврощаются тольео те данные каторые нужны для создания одного персонажа
    }

    const getAllComics = async (offset = 0) => {
        const res = await request(`${_apiBAse}comics?limit=8&offset=${offset}&${_apiKey}`)
        // return res;
        return res.data.results.map(_transformComics);
    }
    
    const getComic = async (id) => {
        const res = await request(`${_apiBAse}comics/${id}?${_apiKey}`)
        return _transformComics(res.data.results[0]);
    }

    // _transformCharacter = (res) => { // _ значит нельзя изменять
    const _transformCharacter = (char) => { // _ значит нельзя изменять
        return {
            id: char.id,
            name: char.name,
            description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
            // description это строка а страку можно представить как массив берем от 0 до 210 элимента в массиве slice(0, 210)
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
            // name: res.data.results[0].name,
            // description: res.data.results[0].description,
            // thumbnail: res.data.results[0].thumbnail.path + '.' + res.data.results[0].thumbnail.extension,
            // homepage: res.data.results[0].urls[0].url,
            // wiki: res.data.results[0].urls[1].url
        }
    }

    const _transformComics = (comics) => {
        return{
            id: comics.id,
            title: comics.title,
            description: comics.description || 'There is no description',
            pageCount: comics.pageCount ? `${comics.pageCount} р.` : 'No information about the number of pages',
            thumbnail: comics.thumbnail.path + '.' + comics.thumbnail.extension,
            language: comics.textObjects.language || 'en-us',
            prices: comics.prices[0].price ? `${comics.prices[0].price}$` : 'not available'
        }
    }
    // так как useMarvelService наш кастомный хук тоже из него возвращаем все свойства и методы каторые нам нужны в приложении
    return {loading, error, getAllCharacters, getCharacters, clearError, getAllComics, getComic}
}

// export default MarvelService; // экспортруем класс в index.js
export default useMarvelService;