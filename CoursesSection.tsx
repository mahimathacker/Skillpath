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

function isCourse(value: unknown): value is Course {
    if (typeof value !== "object" || value === null) {
        return false
    }

    const course = value as Record<string, unknown>

    return (
        typeof course.courseName === "string" &&
        typeof course.description === "string" &&
        typeof course.mainCategory === "string" &&
        typeof course.pricePaise === "number" &&
        Number.isFinite(course.pricePaise) &&
        typeof course.priceUsdCents === "number" &&
        Number.isFinite(course.priceUsdCents) &&
        typeof course.refundable === "boolean"
    )
}

function isCourseArray(value: unknown): value is Course[] {
    return Array.isArray(value) && value.every(isCourse)
}

function isCountryResponse(value: unknown): value is CountryResponse {
    if (typeof value !== "object" || value === null) {
        return false
    }

    const response = value as Record<string, unknown>

    return response.country_code === "IN" || response.country_code === "US"
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
