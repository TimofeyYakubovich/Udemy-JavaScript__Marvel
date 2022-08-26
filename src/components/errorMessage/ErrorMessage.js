import img from './error.gif'; // просто ипортируем путь к этой картинке

const ErrorMessage = () => {
    return (
        // <img src={process.env.PUBLIC_URL + '/error.gif'}/>
        // если вдруг надо обратится к статичным файлам это те каторые лежат в папке public
        // для этого надо использовать переменную окружения process.env.PUBLIC_URL там есть несколько переменных
        // это только ссылка на папку public дальше надо прописать путь к файлу
        <img style={{ display: 'block', width: "250px", height: "250px",objectFit: 'contain', margin: "0 auto"}} 
        src={img} alt="Error"/>
    )
}

export default ErrorMessage;