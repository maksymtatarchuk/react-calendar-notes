const TopMenu = () => {
    return (
        <div className='top-menu'>
            <div className='top-menu-buttons'>
                <button onClick={() => setView('month')}>Month</button>
                <button onClick={() => setView('week')}>Week</button>
            </div>

            <h3 className='top-menu-date'>Month, year</h3>

            <div className='top-menu-buttons'></div>
        </div>
    )
}

export default TopMenu