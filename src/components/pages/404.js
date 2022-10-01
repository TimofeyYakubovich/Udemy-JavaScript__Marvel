import ErrorMessage from "../errorMessage/ErrorMessage"
import { Link } from "react-router-dom"
// эту ссылку будем использовать что бы перенаправляь нашего пользователя назад на главную страницу

const Page404 = () => {
    return (
        // сдесь что бы не сломать верстку понадобиться div а не фрагмент
        <div>
            <ErrorMessage/>
            <p style={{'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px'}} >Page doesn't exist</p>
            <Link style={{'display': 'block', 'textAlign': 'center', 'fontWeight': 'bold', 'fontSize': '24px', 'marginTop': '30px'}} to="/">
            Back to main page</Link>
        </div>
    )
}

export default Page404;