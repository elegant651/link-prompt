import { Button, Card } from "@mui/material"

interface ICard {
  url: string | undefined
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

export const SearchCard = ({ url, onClick }: ICard) => {
  return (
      <a href="#" onClick={onClick}>
        <Card>
          <img src={url} alt={'photo'} loading="lazy" width={250}  />
          <Button>Select</Button>
        </Card>
      </a>
  )
}