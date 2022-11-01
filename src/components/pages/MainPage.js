import { useState } from "react";
import { Helmet } from "react-helmet";

import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import CharSearchForm from "../CharSearchForm/CharSearchForm";
import ErrorBoundary from "../errorBoundary/ErrorBoundary";

import decoration from '../../resources/img/vision.png';

const MainPage = () => {
    
    const [selectedChar, setChar] = useState(null);
    
    const onCharSelected = (id) => { 
        setChar(id);
    }
    console.log('mp')
    return (
        <>
            <Helmet>
                <meta
                    name="description"
                    content="Marvel information portal"
                />
                <title>Marvel information portal</title>
            </Helmet>
            <ErrorBoundary>
                <RandomChar/>
            </ErrorBoundary>
            <div className="char__content">
                <ErrorBoundary>
                    <CharList onCharSelected={onCharSelected}/>
                </ErrorBoundary>
                <div>
                    <ErrorBoundary>
                        <CharInfo charId={selectedChar}/>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <CharSearchForm/>
                    </ErrorBoundary>
                </div>
            </div>
            <img className="bg-decoration" src={decoration} alt="vision"/>
        </>
    )
}

export default MainPage;

// Lesson 186 SEO-оптимизация веб-приложений (Search Engine Optimization, поисковая оптимизация)

// когда мы что то гуглим или используем яндекс поис или любой другой сайты выстраиваются в список по порядку вот от поисковой оптимизации
// зависит позиция ресурса в этом списке чем лучше все меры соблюдены тем выше ссылка в списке
// анализом того что ресур соблюдает все рекомендации занимаются специальные поисковые роботы и разработчикам необходимо их все учесть 
// со стороны контента, ключевых слов и ссылок занимаются другие люди
// основные технические критерии
// - скорость загрузки сайта
// - валидность верстки
// - семантическая верстка, правильная приминение тегов

// назначения веб приложения, если это административная понел для какого то ресурса то и SEO там не нужно обычные пользователи туда не попадут
// ну если контентное приложение то SEO конечно обязательно
// если инструмент например figma каторый просто работает в браузере то SEO уме никчему

// еще проблема весь контент веб приложения генерируется через JS код это значит что изночально сама страница пустая
// если поисковый робот придет на сервер то по запросу главной страници он получит пустой index.html и ссылак на другие страници тоже не увидит
// поисковые роботы не умеют выполнять JS код  при поиске страниц но потехоньку учаться

// одно из решений это рендеринг приложения на стороне сервера когда поисковому роботу уже будет отдаваться готовая страница
// такой прием называется Server Side Rendering и с реактом чаще всего применяется фреймворк Next.js

// еще одно решение это пререндеринг это когда создается продакшен билд приложение и дополнительно сохраняются html копии каждой страници 
// в приложении делается это при помощи специальных библиотек и там чаще всего используется headless-браузер это браузер без визуальной 
// оболочки и поисковому робату уже отдаются эти копии html страниц
// одна из самых популярных таких библиотек react-snap

// мета теги и тайтлы длжны быть на каждой странице разными в этом приложении сейчас они на всех страницах одинаковые за счет того что 
// они один раз прописаны в index.html в реакте этим занимается библиотека react-helmet ее функцинал позволяет динамически изменять 9 парраметров
// на данный момент base bodyAttributes htmlAttributes link meta noscript script style title
// meta - обычные meta теги, base - базовая ссылка, также можно динамичски добовлять в head скрипты script и стили style
// устанавливаем react-helmet npm install --save react-helmet
// импортруем главный компанент Helmet в него прописываем нужные для этой страници мета теги и тайтл
// обычно в Helmet много различных meta тегов и тд. каторыми занимаются восновном сиошники
// данные в Helmet можно вставлять и динамически в зависимости от контента
// если внутри вложенного компанента назначить еще раз Helmet то вложенные значения просто перезапишут то что прописано в компаненте выше

