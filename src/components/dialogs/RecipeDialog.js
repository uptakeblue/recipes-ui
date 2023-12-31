// general
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive'
import { useNavigate } from 'react-router-dom';

// material ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import { IconButton, Paper, Typography } from '@mui/material';
import { green } from '@mui/material/colors';

// icons
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// custom components
import { CustomColorScheme } from '../CustomTheme';

////////////////////////////////


const RecipeDialog = (props) => {
    const {
        dialogOpen,
        setDialogOpen,
        recipe,
        updateRecipe,
    } = props;

    // constants////////////////

    const [title, setTitle] = useState('');
    const [originalTitle, setOriginalTitle] = useState('');
    const [recipeId, setRecipeId] = useState();
    const [description, setDescription] = useState('');
    const [note, setNote] = useState('');
    const [imageFile, setImageFile] = useState('');
    const [previewFile, setPreviewFile] = useState('');
    const [previewFileUri, setPreviewFileUri] = useState('');
    const [previewFileName, setPreviewFileName] = useState('');
    const [originalRoute, setOriginalRoute] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);

    const [isTitleError, setIsTitleError] = useState(false);

    const isMobile = useMediaQuery({ query: '(max-width: 750px)' })
    const navigate = useNavigate();


    // event handlers //////////

    const handleTitleChange = (event) => {
        let t = event.currentTarget.value;
        setTitle(t);
        setIsTitleError(!t);
    }

    const handleFilePreview = (event) => {
        if (event.target.files[0]) {
            let file = event.target.files[0]
            setPreviewFileName(file.name);
            setPreviewFile(file);
            setPreviewFileUri(URL.createObjectURL(file))
        } else {
            setPreviewFile(null);
        }
    }

    const handleImageClear = () => {
        setPreviewFileUri(null);
        setImageFile(null)
    }

    const handleRecipeSave = () => {
        let route = (title === originalTitle)
            ? originalRoute
            : title.replace(/[\W_]+/g, "-").replace(/^-+/, '').replace(/-+$/, '').toLowerCase();

        let formData = new FormData();
        if (previewFile) {
            formData.append('file', previewFile);
        } else {
            formData.append('imageFile', imageFile);
        }
        formData.append('recipeId', recipeId);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('note', note);
        formData.append('route', route);
        formData.append('isfavorite', isFavorite);
        updateRecipe(formData);
        setDialogOpen(false);
    }

    // useEffect ///////////////

    useEffect(() => {
        if (!dialogOpen) {
            setTitle('');
            setOriginalTitle('');
            setDescription('');
            setNote('');
            setImageFile('');
            setOriginalRoute('');
            setIsFavorite(false);
            setRecipeId(null);
            setPreviewFileUri(null);
            setPreviewFile(null);
            setPreviewFileName(null)
        } else {
            setTitle(recipe.title);
            setOriginalTitle(recipe.title);
            setDescription(recipe.description);
            setNote(recipe.note);
            setImageFile(recipe.imageFile);
            setOriginalRoute(recipe.route);
            setIsFavorite(recipe.isFavorite);
            setRecipeId(recipe.recipeId);
            setPreviewFileName(recipe.imageFile ? recipe.imageFile : '')
            setPreviewFileUri(recipe.imageFile ? `${process.env.REACT_APP_API_IMAGE_URL + "/" + recipe.imageFile}` : '');
        }
        setIsTitleError(false);
    }, [dialogOpen]);


    // render //////////////////

    return (
        <>
            {
                recipe &&
                <Dialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    maxWidth='xl'         >
                    <Box
                        width={isMobile ? 350 : 500}
                    >
                        <Box
                            bgcolor={CustomColorScheme['text']}
                            color={CustomColorScheme['white']}
                            paddingY={1}
                            paddingX={2.5}
                        >
                            Edit Recipe
                        </Box>

                        <Paper
                            sx={{
                                padding: 2,
                                bgcolor: CustomColorScheme['lightTan'],
                                width: isMobile ? '85%' : 'auto',
                            }}
                        >
                            <Stack spacing={1}>
                                <Stack direction='row'>
                                    <FormControl
                                        error={isTitleError}
                                        sx={{
                                            width: '100%',
                                            marginRight: 1,
                                        }}
                                    >
                                        <TextField
                                            value={title}
                                            onChange={handleTitleChange}
                                            label="Title"
                                            variant='standard'
                                            error={isTitleError}
                                            padding={1}
                                            width='100%'
                                            InputLabelProps={{
                                                shrink: true,
                                                sx: {
                                                    marginLeft: 1,
                                                    marginTop: 0.5,
                                                }
                                            }}
                                            sx={{
                                                backgroundColor: CustomColorScheme['white'],
                                                padding: 1,
                                                '& .MuiInput-input': {
                                                    fontFamily: 'monospace',
                                                    color: 'darkblue',
                                                    fontSize: 18,
                                                }
                                            }}
                                        />
                                        {
                                            isTitleError &&
                                            <FormHelperText>Title is required</FormHelperText>
                                        }
                                    </FormControl>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <IconButton
                                            onClick={() => setIsFavorite(!isFavorite)}
                                        >
                                            {
                                                isFavorite
                                                    ? <FavoriteIcon
                                                        sx={{
                                                            color: CustomColorScheme['darkRed'],
                                                        }}
                                                    />
                                                    : <FavoriteBorderIcon />
                                            }
                                        </IconButton>
                                    </Box>
                                </Stack>
                                <Stack direction='row' spacing={1}>
                                    {
                                        previewFileUri &&
                                        <Stack>
                                            <img
                                                src={previewFileUri}
                                                width={isMobile ? 250 : 350}
                                                height='auto'
                                                border='none'
                                                style={{
                                                    borderRadius: 10,
                                                }}
                                            />
                                            <Typography
                                                variant='body1'
                                                component='div'
                                                fontSize={14}
                                                fontWeight='bold'
                                                paddingY={1}
                                            >
                                                {previewFileName}
                                            </Typography>
                                        </Stack>
                                    }
                                    <Box
                                        display='flex'
                                        flexGrow={1}
                                        justifyContent='end'
                                        alignItems='center'
                                    >
                                        <Stack>
                                            <input
                                                id="image-select"
                                                style={{
                                                    display: "none"
                                                }}
                                                type="file"
                                                onChange={handleFilePreview}
                                                name="file"
                                            />
                                            <Tooltip title='Browse for an image file' >
                                                <label htmlFor='image-select'>
                                                    <IconButton
                                                        component="span"
                                                    >
                                                        <ImageSearchIcon />
                                                    </IconButton>
                                                </label>
                                            </Tooltip>
                                            {
                                                previewFileUri &&
                                                <Tooltip title='Clear image file' >
                                                    <IconButton
                                                        onClick={handleImageClear}
                                                    >
                                                        <DeleteOutlineOutlinedIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            }
                                        </Stack>
                                    </Box>
                                </Stack>
                                <TextField
                                    value={description}
                                    onChange={(e) => setDescription(e.currentTarget.value)}
                                    label="Description"
                                    variant='standard'
                                    padding={1}
                                    multiline
                                    minRows={3}
                                    maxRows={5}
                                    InputLabelProps={{
                                        shrink: true,
                                        sx: {
                                            marginLeft: 1,
                                            marginTop: 0.5,
                                        }
                                    }}
                                    sx={{
                                        backgroundColor: CustomColorScheme['white'],
                                        padding: 1,
                                        fontFamily: 'Times New Roman',
                                        '& .MuiInput-input': {
                                            fontFamily: 'monospace',
                                            lineHeight: 1.25,
                                            color: 'darkblue',
                                        }
                                    }}
                                />
                                <TextField
                                    value={note}
                                    onChange={(e) => setNote(e.currentTarget.value)}
                                    label="Note"
                                    variant='standard'
                                    multiline
                                    minRows={4}
                                    padding={1}
                                    InputLabelProps={{
                                        shrink: true,
                                        sx: {
                                            marginLeft: 1,
                                            marginTop: 0.5,
                                        }
                                    }}
                                    sx={{
                                        backgroundColor: CustomColorScheme['white'],
                                        padding: 1,
                                        '& .MuiInput-input': {
                                            fontFamily: 'monospace',
                                            lineHeight: 1.25,
                                            color: 'darkblue',
                                        }
                                    }}
                                />

                            </Stack>
                            <Stack
                                direction='row'
                                spacing={1}
                                justifyContent='end'
                                marginTop={1}
                            >
                                <Button
                                    variant='outlined'
                                    sx={{
                                        color: CustomColorScheme['text'],
                                        borderColor: CustomColorScheme['text'],
                                        '&:hover': {
                                            color: green[600],
                                            borderColor: green[600],
                                        }
                                    }}
                                    onClick={handleRecipeSave}
                                >Save
                                </Button>
                                <Button
                                    sx={{
                                        color: CustomColorScheme['text'],
                                    }}
                                    onClick={() => setDialogOpen(false)}
                                >
                                    Return
                                </Button>
                            </Stack>
                        </Paper>
                    </Box>
                </Dialog >
            }
        </>
    )
}

export default RecipeDialog;