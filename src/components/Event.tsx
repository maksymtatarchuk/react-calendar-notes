const Event = (props: { event: { id: string, title: string, colors: string[], tags: string[], isPublicHoliday: boolean } }) => {

    return (
        <div id={props.event.id} className={'custom-event-wrapper ' + (props.event.isPublicHoliday ? ' public-holiday' : '')} key={props.event.id}>
            <div className="event-color-tag">
                {props.event.colors.map((color: string) => {
                    return <div className={color + '-color-tag color-tag-stick'} key={color}></div>
                })}
            </div>

            <div className="event-tags">
                {props.event.tags.map((tag: string) => {
                    return <div className="event-tag" key={tag}>{tag}</div>
                })}
            </div>

            <div className="event-title">{props.event.title}</div>

        </div>
    )
}

export default Event