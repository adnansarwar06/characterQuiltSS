import { StudentTable } from './components/StudentTable';
import { initialStudentData } from './config/InitialStudentData';
import styled from 'styled-components';

const AppContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.h1`
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
`;

/**
 * Main application component that renders the student table
 * @returns {JSX.Element} The rendered application
 */
function App() {
  return (
    <AppContainer>
      <Header>Student Records</Header>
      <StudentTable initialData={initialStudentData} />
    </AppContainer>
  );
}

export default App;
