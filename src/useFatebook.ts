import { useState, useEffect } from 'react';
import { Question, SubmitQuestionData } from './types';

export const useFetchQuestions = (apiKey: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`https://fatebook.io/api/v0/getQuestions?apiKey=${apiKey}&limit=1000`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const data = await response.json();
      setQuestions(data.items);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("running")
    fetchQuestions();
  }, [apiKey]);


  return { results: questions, isLoading, error, fetchQuestions };
};

export const useSubmitQuestion = (apiKey: string) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  const submitQuestion = async (questionData: SubmitQuestionData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 1)

    const queryParams = new URLSearchParams({
      apiKey: apiKey,
      title: questionData.title,
      resolveBy: !!questionData.resolveBy ? questionData.resolveBy : defaultDate.toISOString(),
      ...(questionData.forecast && { forecast: questionData.forecast.toString() }),
      ...(questionData.sharePublicly && { sharePublicly: questionData.sharePublicly ? 'yes' : 'no' }),
      ...(questionData.hideForecastsUntil && { hideForecastsUntil: questionData.hideForecastsUntil }),
    });

    questionData.tags?.forEach(tag => queryParams.append('tags', tag));
    questionData.shareWithLists?.forEach(list => queryParams.append('shareWithLists', list));
    questionData.shareWithEmail?.forEach(email => queryParams.append('shareWithEmail', email));

    const url = `https://fatebook.io/api/v0/createQuestion?${queryParams.toString()}`;

    console.log(url)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: questionData.description }),
      });
      console.log(response.json())
      if (!response.ok) {
        throw new Error('Failed to submit question');
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(error as Error);
    } finally {
      setIsSubmitting(false);
    }
  };
  console.log("submitError", submitError)

  return { submitQuestion, isSubmitting, submitError, submitSuccess };
};



// Fatebook API
// Use the API to create Fatebook questions from a URL
// 8iuebb5pbfyoeepq99dbh
// You can use your API key to create Fatebook questions just by going this URL (separated onto multiple lines for readability):

// https://fatebook.io/api/v0/createQuestion?apiKey=8iuebb5pbfyoeepq99dbh
// &title=YOUR_QUESTION_TITLE
// &resolveBy=RESOLUTION_DATE_YYYY-MM-DD
// &forecast=FORECAST_BETWEEN_0_AND_1

// You can also add some optional parameters, here's an example:

// https://fatebook.io/api/v0/createQuestion?apiKey=8iuebb5pbfyoeepq99dbh
// &title=YOUR_QUESTION_TITLE
// &resolveBy=RESOLUTION_DATE_YYYY-MM-DD
// &forecast=FORECAST_BETWEEN_0_AND_1
// &tags=TAG_1
// &tags=TAG_2
// &sharePublicly=yes
// &shareWithLists=LIST_NAME_1
// &shareWithLists=LIST_NAME_2
// &shareWithEmail=EMAIL_1
// &shareWithEmail=EMAIL_2
// &hideForecastsUntil=HIDE_FORECASTS_UNTIL_DATE_YYYY-MM-DD

// You can use this to integrate Fatebook with other tools, like iOS shortcuts. If you create an integration, let us know and we can tell other Fatebook users about it!

// Having trouble? Ask for help in Discord.

// Integrations that other Fatebook users have created:
// An iOS shortcut to create a Fatebook question - by @JasperGo. You can add it to your homescreen or use Siri to create a question!
// An Emacs plugin to create Fatebook questions - by @sonofhypnos
// An Alfred workflow to create Fatebook questions - by Caleb Parikh
// Use the API to get Fatebook questions by ID
// You can also use the API to get Fatebook questions by ID, here's an example:

// https://fatebook.io/api/v0/getQuestion?apiKey=8iuebb5pbfyoeepq99dbh
// &questionId=QUESTION_ID

// To get the question ID, go to the question page and copy the ID from the URL. The ID is the part after the --, e.g. for this question: https://fatebook.io/q/will-adam-win-the-next-aoe-game---clkqtczp00001l008qcrma6s7 the ID is clkqtczp00001l008qcrma6s7.

// Click here to see an example of the getQuestion endpoint in action.

// Fatebook OpenAPI
//  1.0.0 
// OAS 3.0
// /api/openapi.json
// Servers

// https://fatebook.io/api
// default

// GET
// /v0/getQuestions
// By default, this fetches all questions that you've created, forecasted on, or are shared with you. Alternatively, if you set showAllPublic to true, it fetches all public questions from fatebook.io/public.

// Parameters
// Name	Description
// apiKey *
// string
// (query)
// Your Fatebook API key. Get it at fatebook.io/api-setup

// apiKey
// resolved
// boolean
// (query)
// Only get resolved questions


// --
// readyToResolve
// boolean
// (query)
// Only get questions ready to be resolved


// --
// resolvingSoon
// boolean
// (query)
// Only get questions that are resolving soon


// --
// filterTagIds
// string
// (query)
// Comma-separated list of tag IDs. Only get questions with at least one of these tags

// filterTagIds
// showAllPublic
// boolean
// (query)
// Show all public questions from fatebook.io/public (if false, get only questions you've created, forecasted on, or are shared with you)


// --
// searchString
// string
// (query)
// Only get questions containing this search string

// searchString
// theirUserId
// string
// (query)
// Show questions created by this user (instead of your questions)

// theirUserId
// filterTournamentId
// string
// (query)
// Show questions in this tournament (instead of your questions)

// filterTournamentId
// filterUserListId
// string
// (query)
// Show questions in this team (instead of your questions)

// filterUserListId
// limit
// number
// (query)
// Maximum number of questions to return. Default = 100

// limit
// cursor
// number
// (query)
// Used for pagination. 0 = return the first [limit] questions, 100 = skip the first 100 questions and return the next [limit] questions.

// cursor
// Responses
// Code	Description	Links
// 200	
// Successful response

// Media type

// application/json
// Controls Accept header.
// {}
// No links
// default	
// Error response

// Media type

// application/json
// {
//   "message": "string",
//   "code": "string",
//   "issues": [
//     {
//       "message": "string"
//     }
//   ]
// }
// No links

// POST
// /v0/resolveQuestion
// Resolve the question to YES, NO or AMBIGUOUS

// Parameters
// No parameters

// Request body

// application/json
// {
//   "questionId": "string",
//   "resolution": "string",
//   "apiKey": "string"
// }
// Responses
// Code	Description	Links
// 200	
// Successful response

// Media type

// application/json
// Controls Accept header.
// "string"
// No links
// default	
// Error response

// Media type

// application/json
// {
//   "message": "string",
//   "code": "string",
//   "issues": [
//     {
//       "message": "string"
//     }
//   ]
// }
// No links

// PATCH
// /v0/setSharedPublicly
// Change the visibility of the question. The 'sharedPublicly' parameter sets whether the question is accessible to anyone via a direct link. The 'unlisted' parameter sets whether the question is visible on fatebook.io/public

// Parameters
// No parameters

// Request body

// application/json
// {
//   "questionId": "string",
//   "sharedPublicly": true,
//   "unlisted": true,
//   "apiKey": "string"
// }
// Responses
// Code	Description	Links
// 200	
// Successful response

// Media type

// application/json
// Controls Accept header.
// "string"
// No links
// default	
// Error response

// Media type

// application/json
// {
//   "message": "string",
//   "code": "string",
//   "issues": [
//     {
//       "message": "string"
//     }
//   ]
// }
// No links

// POST
// /v0/addForecast
// Add a forecast to the question. Forecasts are between 0 and 1.

// Parameters
// No parameters

// Request body

// application/json
// {
//   "questionId": "string",
//   "forecast": 1,
//   "apiKey": "string"
// }
// Responses
// Code	Description	Links
// 200	
// Successful response

// Media type

// application/json
// Controls Accept header.
// "string"
// No links
// default	
// Error response

// Media type

// application/json
// {
//   "message": "string",
//   "code": "string",
//   "issues": [
//     {
//       "message": "string"
//     }
//   ]
// }
// No links

// POST
// /v0/addComment
// Parameters
// No parameters

// Request body

// application/json
// {
//   "questionId": "string",
//   "comment": "string",
//   "apiKey": "string"
// }
// Responses
// Code	Description	Links
// 200	
// Successful response

// Media type

// application/json
// Controls Accept header.
// "string"
// No links
// default	
// Error response

// Media type

// application/json
// {
//   "message": "string",
//   "code": "string",
//   "issues": [
//     {
//       "message": "string"
//     }
//   ]
// }
// No links

// DELETE
// /v0/deleteQuestion
// Parameters
// Name	Description
// questionId *
// string
// (query)
// questionId
// apiKey
// string
// (query)
// apiKey
// Responses
// Code	Description	Links
// 200	
// Successful response

// Media type

// application/json
// Controls Accept header.
// "string"
// No links
// default	
// Error response

// Media type

// application/json
// {
//   "message": "string",
//   "code": "string",
//   "issues": [
//     {
//       "message": "string"
//     }
//   ]
// }
// No links

// PATCH
// /v0/editQuestion
// Parameters
// No parameters

// Request body

// application/json
// {
//   "questionId": "string",
//   "title": "string",
//   "resolveBy": "2024-04-29T00:32:19.778Z",
//   "apiKey": "string"
// }
// Responses
// Code	Description	Links
// 200	
// Successful response

// Media type

// application/json
// Controls Accept header.
// "string"
// No links
// default	
// Error response

// Media type

// application/json
// {
//   "message": "string",
//   "code": "string",
//   "issues": [
//     {
//       "message": "string"
//     }
//   ]
// }
// No links
// EA Forum
// Discord
// Twitter
// Github
// Sage Future Inc
// Privacy Policy Terms of Use

