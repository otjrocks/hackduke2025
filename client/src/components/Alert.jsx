export default function Alert(props) {
    const {text} = props
    return (
        <div role="alert" className="alert">
            <span>{text}</span>
        </div>
    )
}