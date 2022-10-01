import {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setnewItemLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [comicsEnded, setComicsEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onRequest(offset, true);
    }, [])

    const onRequest = (offset, initial) => {
        initial ? setnewItemLoading(false) : setnewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }
        setComicsList([...comicsList, ...newComicsList]);
        setnewItemLoading(false);
        setOffset(offset + 8);
        setComicsEnded(ended);
    }

    // динамическое формирование страници по клику
    // при клике на каждый отдельный комикс будет формироваться страница с полным описанием этого комикса
    // Router умеет формировать динамические пути

    function renderItems (arr) {
        const items = arr.map(item => {
            return (
                <li className="comics__item" key={item.id}>
                    {/* <a href="#"> */}
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                    <Link to={`/comics/${item.id}`}>
                        {/* для того что бы конкретно указать какой комикс будет открываться его нужно как то идентифицировать для этого из всех
                        данных подходит id теперь при нажатии на каждый комикс в юрд пути подставляется id комикса
                        логика такая когда мы переходим на страницу комикса (с id) она длжна получать это id и по нему делать запрос на сервер*/}
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.prices}</div>
                    </Link>
                    {/* </a> */}
                </li>
            )
        })
        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    // Lesson 176 динамические импорты оптимизация приложения и скорость его работы
    // приложение в ходе разработки становится все больше и больше и в какой то момент омжно придти к тому что приожение будет долго грузиться
    // из за своего размера поэтому стоит задуматься о разделении приложения на отдельно загружающиеся кусочки
    // допустим у нас 10 страниц и мы хотим загрузить только одну при самом первом запуске для этого применяются динамические импорты
    // до этого мы использовали статические импорты во всех файлах import { MainPage, ComicsPage, Page404, SingleComicPage } from "../pages"
    // это значит что когда будет файл собираться в него будет загружен кусок кода из другого файла
    // но в js есть синтаксис что бы подгружать что то по требованию например внутри услвия

    // создадим в папке comicsList тестовый файл someFunc.js и из него будем экспортровать функцию logger
    // теперь будем запускать функцию logger внутри файла comicsList в определенном условии
    // если что то произошло тогда динамически подгружаем файл someFunc.js функцию logger и запускаем ее

    // когда loading будет true когда компанент будет запускаться будем запускать функцию logger
    // к примеру при каждой загрузке компанента нужно отправлять данные на сервер

    // if (loading) { 
    //     import('./someFunc') // динамический импорт всегда возвращает промис с объектом модуля
    //         .then(obj => obj.logger()) // как обычная работа с промисами получаем объект модуля obj внутри объекта функция logger каторую запускаем
    //         .catch(); // всегда обезательно нужно указывать catch ошибки могут быть часто
    // }

        // когда мы что то экспортируем из файла на самом деле мы экспортируем объект
        // если это именованый экспорт export function logger то на выходе создается объект со свойством logger каторое содержит функцию
        // если это экспорт поумолчанию то там создается объект с одним свойством default и в него помещается то что мы экспортируем поумолчанию

    // динамический импорт ткрывает бльшие возможности какие то тяжёлые компаненты или функции можно грузить только тогда когда это нужно

    // если нужно из файла someFunc.js вытащить сразу 2 функции можно использовать асинхронный синтаксис диструктаризации потому что в итоге
    // динамического импорта возвращается объект со свойствами

    // const dynamic = async () => { // асинхронная потмоу что мы не знаем через сколько someFunc.js отдаст результат и поэтому мы получаем промис
    //     const {logger, secondLog} = await import('./someFunc');
    //     logger(); // этот синтаксис удобние потому мы динамического вытаскиваем эти функции и потом можно дальше их где то использовать
    //     secondLog(); // не привязываясь к then
    // }
    // if (loading) {
    //     dynamic();
    // }

    // экспорт подефолту в динмаическом экспорте по дефолту мы должны использовать ключевое слово default
    // если мы экспортировать функцию defaultLog() используем дефолтный экспорт то она будет лежать в свойстве default

    // if (loading) { 
    //     import('./someFunc')
    //         .then(obj => obj.default())
    //         .catch();
    // }

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                disabled={newItemLoading} 
                style={{'display' : comicsEnded ? 'none' : 'block'}}
                className="button button__main button__long"
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;