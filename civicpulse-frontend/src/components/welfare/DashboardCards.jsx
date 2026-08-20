import {
    Grid,
    Card,
    CardContent,
    Typography
} from "@mui/material";

const cards = [
    {
        title: "Total Schemes",
        value: 24
    },
    {
        title: "Active Schemes",
        value: 18
    },
    {
        title: "Applications",
        value: 348
    },
    {
        title: "Beneficiaries",
        value: 192
    },
    {
        title: "Budget Utilized",
        value: "₹2.4 Cr"
    }
];

export default function DashboardCards() {

    return (

        <Grid container spacing={3}>

            {cards.map((card) => (

                <Grid
                    item
                    xs={12}
                    sm={6}
                    md={2.4}
                    key={card.title}
                >

                    <Card elevation={3}>

                        <CardContent>

                            <Typography
                                variant="subtitle2"
                                color="text.secondary">

                                {card.title}

                            </Typography>

                            <Typography
                                variant="h4"
                                fontWeight="bold">

                                {card.value}

                            </Typography>

                        </CardContent>

                    </Card>

                </Grid>

            ))}

        </Grid>

    );

}