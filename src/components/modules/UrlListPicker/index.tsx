import { Link } from "@mui/icons-material";
import { Checkbox, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";

export default function UrlListPicker(props: { items: string[], itemsSelected: string[], selectItem: (item: string) => void }) {
    const { items, itemsSelected, selectItem } = props;
    return (
        <List sx={{
            maxHeight: 400,
            overflow: 'auto'
        }}>
            {items.map((item, index) => {
                return (
                    <ListItem key={`select-items-${index}`}
                        secondaryAction={
                            <Tooltip title={item}>
                                <IconButton edge="end" href={item} target="_blank">
                                    <Link />
                                </IconButton>
                            </Tooltip>
                        }>
                        <ListItemButton onClick={() => selectItem(item)}>
                            <ListItemIcon>
                                <Checkbox checked={itemsSelected.includes(item)} />
                            </ListItemIcon>
                            <ListItemText>
                                {item}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
}