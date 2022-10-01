import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './singleComic.scss';
// import xMen from '../../resources/img/x-men.png';

// Lesson 175
// возможности библиотеки react-router-dom
// когда используем компанент Route у него внутри есть 3 объекта match, location, history

// объект match с данными о том как именно path совпал с текущи адресом и в нем же есть параметр id каторый мы передаем
// в нем есть свойство params это тоже объект карый содержит ключ значение каторая была вытащена из юрл путя ключем будет comic.id значение само id
// каторое передалсь в юрл
// свойство isExact совпало ли полность или частично
// и 2 свойства строки path и url они поразному отображают текущее состояние юрд адреса
// обратиться к match можно поразному в документации если в компаненте this.props.match в методе render ({ match }) => () и тд.
// есть и специальные хуки что бы получить отдельно params так как оно чаще всего используется

// объект history давольно большой объект это API для арганизации перехода между страницами
// его методы goBack() что бы отправить пользователя назад, goForward(), block(prompt)

// объект location по простому это состяние и положение нашего рутера
// { key: 'ac3df4', // not with HashHistory! pathname: '/somewhere', search: '?some=search-string', hash: '#howdy', state: { [userDefined]: true }}
// в хуке componentWillReceiveProps можно проверять изменилась ли локация
  
// сделаем частную маршрутизацию это когда открываем отдельную страницу через параметры
// этот функционал настолько часто применяется что его отдельно вынесли в отдельный хук useParams
// этот хук возвращает объект в формате ключ значение с параметрами в юрл адресе
// есть еще 2 хука useHistory и useLocation

// в этом компаненте будем испьзовать хук useParams

const SingleComicPage = () => {
    // const smth = useParams(); // в smth приходит объект с айдишкой { comicId: "82970" } ключ мы прописали вручную своё название
    // console.log(smth);

    const {comicId} = useParams();
    const [comic, setComic] = useState(null);

    const {loading, error, getComic, clearError} = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [comicId]) // прописываем comicId на случай если пользователь вручную пропишит в юрл другой id

    const updateComic = () => {
        clearError();
        getComic(comicId)
            .then(onComicLoaded)
    }

    const onComicLoaded = (comic) => {
        setComic(comic);
    }

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !comic) ? <View comic={comic}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>

        // <div className="single-comic">
        //     <img src={xMen} alt="x-men" className="single-comic__img"/>
        //     <div className="single-comic__info">
        //         <h2 className="single-comic__name">X-Men: Days of Future Past</h2>
        //         <p className="single-comic__descr">Re-live the legendary first journey into the dystopian future of 2013 - where Sentinels stalk the Earth, and the X-Men are humanity's only hope...until they die! Also featuring the first appearance of Alpha Flight, the return of the Wendigo, the history of the X-Men from Cyclops himself...and a demon for Christmas!?</p>
        //         <p className="single-comic__descr">144 pages</p>
        //         <p className="single-comic__descr">Language: en-us</p>
        //         <div className="single-comic__price">9.99$</div>
        //     </div>
        //     <a href="#" className="single-comic__back">Back to all</a>
        // </div>
    )
}

const View = ({comic}) => {

    const {thumbnail, title, description, pageCount, language, prices} = comic;

    return (
        <div className="single-comic">
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{prices}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )

}

export default SingleComicPage;