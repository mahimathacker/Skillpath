type Course = {
    courseName: string
    description: string
    mainCategory: string
    pricePaise: number
    priceUsdCents: number
    refundable: boolean
}

type CountryCode = "IN" | "US"

type CountryResponse = {
    country_code: CountryCode
}

export default function CoursesSection() {
    return (
        <section style={styles.section}>
            <p style={styles.message}>Courses component</p>
        </section>
    )
}

const styles = {
    section: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
    },
    message: {
        margin: 0,
        color: "#1F1633",
        fontSize: "18px",
    },
}
